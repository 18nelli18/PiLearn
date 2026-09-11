/**
 * cours-log — garde une trace écrite de tout ce qui est dit pendant un apprentissage.
 *
 * Miroir automatique de la session dans un fichier Markdown lisible : prompts de
 * l'utilisateur, prose de l'agent (y compris les blocs ```mermaid), et les questions /
 * réponses d'`ask_user_question`. Le bruit d'outillage (bash, read, write, edit, grep…)
 * est volontairement omis — on veut un cours relisible, pas un log de debug.
 *
 * Deux niveaux de trace dans ce projet :
 *   - `cours/<etape>/cours.md`      — le cours structuré, écrit par l'Enseignant
 *   - `cours/<etape>/transcript.md` — ce fichier-ci, le brut, automatique
 *
 * L'enregistrement démarre seul dès la première parole de la session, dans
 * `cours/_brut/<date>.md`. Quand l'agent sait sur quelle étape il travaille, il appelle
 * l'outil `cours_log` pour rapatrier la trace dans le dossier de l'étape — le transcript
 * déjà écrit est recopié, rien n'est perdu.
 *
 * Outil   : cours_log({ etape: "01-lecture-config" })  |  cours_log({ off: true })
 * Commandes : /cours <etape>   /cours-off   /cours-ou
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import * as fs from "node:fs";
import * as path from "node:path";

const QA_TOOLS = new Set(["ask_user_question", "quiz"]);
const RACINE = "cours";
const DOSSIER_BRUT = "_brut";

export default function coursLog(pi: ExtensionAPI) {
  let fichier: string | null = null;
  let racineProjet = process.cwd();
  // `execute()` d'un outil ne reçoit pas le contexte UI des événements : on garde une
  // référence au dernier contexte de session pour pouvoir rafraîchir la barre d'état.
  let ctxSession: any = null;

  // ── Écriture sérialisée ────────────────────────────────────────────────────
  // Les événements peuvent se chevaucher ; on garde l'ordre d'ajout.

  let verrou: Promise<void> = Promise.resolve();
  function avecVerrou<T>(fn: () => T | Promise<T>): Promise<T> {
    const precedent = verrou;
    let liberer!: () => void;
    verrou = new Promise<void>((r) => {
      liberer = r;
    });
    return precedent.then(fn).finally(() => liberer());
  }

  function ajouter(texte: string): void {
    if (!fichier) return;
    try {
      fs.mkdirSync(path.dirname(fichier), { recursive: true });
      let actuel = "";
      if (fs.existsSync(fichier)) actuel = fs.readFileSync(fichier, "utf-8");
      if (actuel.trim().length === 0) actuel = entete();
      fs.writeFileSync(fichier, `${actuel.replace(/\s*$/, "")}\n\n${texte}\n`, "utf-8");
    } catch {
      // Fichier supprimé sous nos pieds : on ignore plutôt que de casser la session.
    }
  }

  function entete(): string {
    const nom = fichier ? path.basename(path.dirname(fichier)) : "";
    const etape = nom && nom !== DOSSIER_BRUT ? nom : "(étape non encore identifiée)";
    return [
      "---",
      `type: transcript`,
      `etape: ${etape}`,
      `debut: ${new Date().toISOString()}`,
      "---",
      "",
      "# Transcript de session",
      "",
      "> Trace brute et automatique de ce qui a été dit. Le cours rédigé et relisible est",
      "> dans `cours.md`, à côté.",
    ].join("\n");
  }

  function horodatage(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}h${p(d.getMinutes())}`;
  }

  function cheminParDefaut(): string {
    return path.join(racineProjet, RACINE, DOSSIER_BRUT, `${horodatage()}.md`);
  }

  function cheminEtape(etape: string): string {
    const slug = etape
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) throw new Error("Nom d'étape vide après normalisation");
    return path.join(racineProjet, RACINE, slug, "transcript.md");
  }

  function majStatut(ctx: any): void {
    ctx = ctx ?? ctxSession;
    if (!ctx?.hasUI || typeof ctx.ui?.setStatus !== "function") return;
    if (!fichier) {
      ctx.ui.setStatus("cours-log", undefined);
      return;
    }
    const etiquette = path.basename(path.dirname(fichier));
    const theme = ctx.ui.theme;
    const texte = `📝 ${etiquette === DOSSIER_BRUT ? "brut" : etiquette}`;
    ctx.ui.setStatus(
      "cours-log",
      theme?.fg ? theme.fg("accent", "📝 ") + theme.fg("dim", etiquette) : texte,
    );
  }

  // ── Mise en forme ──────────────────────────────────────────────────────────

  function bloc(role: string, corps: string): string {
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return `### ${role} · ${heure}\n\n${corps}`;
  }

  // Les déclarations de skills (`<skill name="…">…tout le SKILL.md…</skill>`) sont du
  // contexte injecté, pas de la parole. On garde le signal, on jette le volume.
  function retirerSkills(texte: string): string {
    return texte.replace(/<skill\b([^>]*)>[\s\S]*?<\/skill>/g, (_m, attrs: string) => {
      const nom = /name="([^"]+)"/.exec(attrs)?.[1];
      return `*(skill chargée : ${nom ?? "inconnue"})*`;
    });
  }

  function texteDuMessage(msg: any): string {
    const c = msg?.content;
    if (typeof c === "string") return c;
    if (Array.isArray(c)) {
      return c
        .filter((p: any) => p?.type === "text" && typeof p.text === "string")
        .map((p: any) => p.text.trim())
        .filter((t: string) => t.length > 0)
        .join("\n\n");
    }
    return "";
  }

  function blocQuestions(input: any): string {
    const questions: any[] = Array.isArray(input?.questions)
      ? input.questions
      : input?.question
        ? [input]
        : [];
    if (questions.length === 0) return "";
    const lignes: string[] = ["**Question posée**", ""];
    for (const q of questions) {
      lignes.push(`**${q.header ? `${q.header} — ` : ""}${q.question ?? ""}**`);
      lignes.push("");
      const options: any[] = Array.isArray(q.options) ? q.options : [];
      options.forEach((o: any, i: number) => {
        const desc = o?.description ? ` — ${o.description}` : "";
        lignes.push(`${i + 1}. ${o?.label ?? ""}${desc}`);
      });
      if (options.length > 0) lignes.push("");
    }
    return lignes.join("\n").trimEnd();
  }

  function blocReponses(details: any, contenuBrut: string): string {
    const reponses: any[] = Array.isArray(details?.answers) ? details.answers : [];
    if (details?.cancelled && reponses.length === 0) {
      return "**Réponse** — *questionnaire abandonné.*";
    }
    if (reponses.length === 0) {
      const t = (contenuBrut || "").trim();
      return t ? `**Réponse**\n\n${t}` : "**Réponse** — *(aucune)*";
    }
    const lignes: string[] = ["**Réponse**", ""];
    for (const r of reponses) {
      let valeur = "(pas de réponse)";
      if (r?.kind === "multi") valeur = (r.selected ?? []).join(", ") || valeur;
      else if (r?.kind === "custom") valeur = r.answer || valeur;
      else valeur = r?.answer ?? valeur;
      lignes.push(`- **${r?.question ?? "?"}** → ${valeur}`);
      if (r?.notes) lignes.push(`  - *note :* ${r.notes}`);
    }
    if (details?.globalNote) {
      lignes.push("");
      lignes.push(`*Note générale :* ${details.globalNote}`);
    }
    return lignes.join("\n");
  }

  // ── Reprise d'état ─────────────────────────────────────────────────────────

  pi.on("session_start", async (_event, ctx: any) => {
    racineProjet = ctx?.cwd ?? process.cwd();
    ctxSession = ctx;
    let dernier: { fichier: string | null } | undefined;
    try {
      for (const e of ctx.sessionManager.getEntries()) {
        if (e.type === "custom" && e.customType === "cours-log") {
          dernier = e.data as { fichier: string | null } | undefined;
        }
      }
    } catch {
      // Pas de session persistée (mode éphémère) : on repart du défaut.
    }
    // `null` explicite = l'utilisateur a coupé l'enregistrement ; on respecte ce choix.
    fichier = dernier ? dernier.fichier : cheminParDefaut();
    majStatut(ctx);
  });

  // ── Capture ────────────────────────────────────────────────────────────────

  pi.on("message_end", async (event: any) => {
    if (!fichier) return;
    const msg = event?.message;
    if (!msg || !("role" in msg)) return;

    if (msg.role === "user") {
      const t = retirerSkills(texteDuMessage(msg).trim());
      if (!t) return;
      await avecVerrou(() => ajouter(bloc("Apprenant", t)));
      return;
    }
    if (msg.role === "assistant") {
      const t = texteDuMessage(msg).trim();
      if (!t) return;
      await avecVerrou(() => ajouter(bloc("Enseignant", t)));
    }
    // Les toolResult passent par `tool_result`, uniquement pour les outils de Q/R.
  });

  // `ask_user_question` ne mélange pas ses options : les arguments de l'appel sont déjà
  // l'ordre affiché. On écrit donc la question AVANT la réponse, pour que la lecture du
  // fichier suive le déroulé réel de la session.
  pi.on("tool_call", async (event: any) => {
    if (!fichier) return;
    if (!QA_TOOLS.has(event?.toolName)) return;
    const b = blocQuestions(event?.input ?? {});
    if (!b) return;
    await avecVerrou(() => ajouter(b));
  });

  pi.on("tool_result", async (event: any) => {
    if (!fichier) return;
    if (!QA_TOOLS.has(event?.toolName)) return;
    const contenu = typeof event?.content === "string" ? event.content : "";
    await avecVerrou(() => ajouter(blocReponses(event?.details, contenu)));
  });

  // ── Rapatriement dans le dossier de l'étape ────────────────────────────────

  function relier(cible: string | null, ctx: any): string {
    const precedent = fichier;
    if (cible === null) {
      fichier = null;
      pi.appendEntry("cours-log", { fichier: null });
      majStatut(ctx);
      return "Enregistrement arrêté.";
    }
    // Recopie ce qui a déjà été écrit pour que rien ne se perde en changeant de fichier.
    let reporte = 0;
    try {
      if (precedent && precedent !== cible && fs.existsSync(precedent)) {
        const deja = fs.readFileSync(precedent, "utf-8");
        if (deja.trim().length > 0) {
          fs.mkdirSync(path.dirname(cible), { recursive: true });
          const existant = fs.existsSync(cible) ? fs.readFileSync(cible, "utf-8") : "";
          // L'en-tête écrit dans `_brut` dit « étape non encore identifiée » : maintenant
          // qu'on la connaît, on la corrige au passage.
          const recale = deja.replace(
            /^(---\n(?:.*\n)*?etape: ).*$/m,
            `$1${path.basename(path.dirname(cible))}`,
          );
          fs.writeFileSync(
            cible,
            existant.trim().length > 0 ? `${existant.replace(/\s*$/, "")}\n\n${recale}` : recale,
            "utf-8",
          );
          reporte = deja.split("\n").length;
          if (path.basename(path.dirname(precedent)) === DOSSIER_BRUT) fs.unlinkSync(precedent);
        }
      }
    } catch {
      // Recopie impossible : on bascule quand même, le fichier d'origine reste sur disque.
    }
    fichier = cible;
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    pi.appendEntry("cours-log", { fichier: cible });
    majStatut(ctx);
    const rel = path.relative(racineProjet, cible);
    return reporte > 0
      ? `Transcript relié à ${rel} (${reporte} lignes déjà écrites reportées).`
      : `Transcript relié à ${rel}.`;
  }

  pi.registerTool({
    name: "cours_log",
    label: "Trace du cours",
    description:
      "Dirige le transcript automatique de la session vers le dossier de l'étape en cours " +
      "(cours/<etape>/transcript.md). À appeler en début de leçon, dès que l'étape est " +
      "connue : ce qui a déjà été enregistré est reporté, rien n'est perdu. " +
      "Appeler avec { off: true } pour arrêter l'enregistrement, ou sans argument pour " +
      "savoir où écrit le transcript.",
    promptSnippet:
      "Diriger la trace écrite de la session vers le dossier de l'étape (cours_log)",
    promptGuidelines: [
      "Appeler cours_log({ etape: \"<numéro>-<slug>\" }) au début de chaque leçon, dès que l'étape travaillée est connue.",
    ],
    parameters: Type.Object({
      etape: Type.Optional(
        Type.String({
          description:
            "Identifiant de l'étape au format '<numéro>-<slug>', par exemple " +
            "'01-lecture-config'. Reprendre la numérotation de plan-projet.md.",
        }),
      ),
      off: Type.Optional(
        Type.Boolean({
          description: "Arrêter l'enregistrement pour le reste de la session.",
        }),
      ),
    }),
    async execute(_toolCallId: string, params: any) {
      const texte = (t: string, erreur = false) => ({
        content: [{ type: "text" as const, text: t }],
        details: {},
        ...(erreur ? { isError: true } : {}),
      });
      try {
        if (params?.off === true) return texte(relier(null, ctxSession));
        if (!params?.etape) {
          return texte(
            fichier
              ? `Transcript en cours : ${path.relative(racineProjet, fichier)}`
              : "Enregistrement arrêté. Rappeler cours_log avec une étape pour le relancer.",
          );
        }
        return texte(relier(cheminEtape(String(params.etape)), ctxSession));
      } catch (e: any) {
        return texte(`Échec : ${e?.message ?? e}`, true);
      }
    },
  });

  // ── Commandes ──────────────────────────────────────────────────────────────

  pi.registerCommand("cours", {
    description: "Diriger le transcript vers cours/<etape>/transcript.md",
    handler: async (args: string, ctx: any) => {
      const a = (args ?? "").trim();
      if (!a) {
        ctx.ui.notify("Usage : /cours <numéro-slug>  (ex. /cours 01-lecture-config)", "warning");
        return;
      }
      try {
        ctx.ui.notify(relier(cheminEtape(a), ctx), "success");
      } catch (e: any) {
        ctx.ui.notify(`Échec : ${e?.message ?? e}`, "error");
      }
    },
  });

  pi.registerCommand("cours-off", {
    description: "Arrêter l'enregistrement du transcript",
    handler: async (_args: string, ctx: any) => {
      ctx.ui.notify(relier(null, ctx), "info");
    },
  });

  pi.registerCommand("cours-ou", {
    description: "Afficher le fichier de transcript actuel",
    handler: async (_args: string, ctx: any) => {
      ctx.ui.notify(
        fichier
          ? `Transcript : ${path.relative(racineProjet, fichier)}`
          : "Enregistrement arrêté (/cours <etape> pour le relancer).",
        "info",
      );
    },
  });
}
