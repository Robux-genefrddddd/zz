import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export default function AdminAIConfigSection() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempConfig, setTempConfig] = useState<AIConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ai-config");
      const data = await response.json();
      setConfig(data);
      setTempConfig({
        ...data,
        systemPrompt:
          data.systemPrompt ||
          "You are a helpful assistant. Always respond in the user's language.",
      });
    } catch (error) {
      toast.error("Erreur lors du chargement de la configuration");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!tempConfig) return;

    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/admin/ai-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(tempConfig),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save config");
      }

      setConfig(tempConfig);
      toast.success("Configuration sauvegardée avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !tempConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-foreground/60" />
      </div>
    );
  }

  const hasChanges = JSON.stringify(config) !== JSON.stringify(tempConfig);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">
          Configuration de l'IA
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          Paramètres du modèle, température, tokens et instructions système
        </p>
      </div>

      {/* Configuration Form */}
      <div className="max-w-2xl space-y-6 rounded-lg border border-white/5 bg-white/[0.02] p-8">
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Modèle IA
          </label>
          <input
            type="text"
            value={tempConfig.model}
            onChange={(e) =>
              setTempConfig({ ...tempConfig, model: e.target.value })
            }
            placeholder="ex: gpt-4o-mini, claude-3-5-sonnet, x-ai/grok-4.1-fast:free"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-foreground/40 hover:border-white/20 focus:border-white/30 transition-colors focus:outline-none"
          />
          <p className="text-xs text-foreground/60 mt-2">
            Entrez le nom exact du modèle d'IA à utiliser (ex: gpt-4, claude-3-opus, grok-4.1-fast)
          </p>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-white">
              Température
            </label>
            <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded">
              {tempConfig.temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={tempConfig.temperature}
            onChange={(e) =>
              setTempConfig({
                ...tempConfig,
                temperature: parseFloat(e.target.value),
              })
            }
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-foreground/60 mt-2">
            <span>Déterministe (0)</span>
            <span>Équilibré (1)</span>
            <span>Créatif (2)</span>
          </div>
          <p className="text-xs text-foreground/60 mt-3">
            Contrôle le caractère aléatoire des réponses. 0 = réponses cohérentes, 2 = réponses créatives et variées.
          </p>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Tokens maxim aux (max_tokens)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="100"
              max="4000"
              step="100"
              value={tempConfig.maxTokens}
              onChange={(e) =>
                setTempConfig({
                  ...tempConfig,
                  maxTokens: parseInt(e.target.value),
                })
              }
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-white/30 transition-colors focus:outline-none"
            />
            <span className="text-sm text-foreground/60">tokens</span>
          </div>
          <p className="text-xs text-foreground/60 mt-2">
            Nombre maximum de tokens dans les réponses de l'IA (1 token ≈ 4 caractères)
          </p>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Instruction système
          </label>
          <textarea
            value={tempConfig.systemPrompt}
            onChange={(e) =>
              setTempConfig({
                ...tempConfig,
                systemPrompt: e.target.value,
              })
            }
            rows={6}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:border-white/20 focus:border-white/30 transition-colors focus:outline-none resize-none font-mono text-sm"
            placeholder="Entrez l'instruction système pour guider le comportement de l'IA..."
          />
          <p className="text-xs text-foreground/60 mt-2">
            Instructions de base pour guider le comportement de l'IA (ex: langage, style, contexte)
          </p>
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        {hasChanges && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-xs text-amber-300">
              Modifications non sauvegardées
            </p>
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setTempConfig(config)}
          disabled={!hasChanges || saving}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Annuler
        </button>
        <button
          onClick={saveConfig}
          disabled={!hasChanges || saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
