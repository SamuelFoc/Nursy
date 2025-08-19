"use client";
import { ChatIcon, ClipboardIcon, ShieldIcon, SparkIcon } from "../custom/Icons";
import { FeatureCard } from "./FeatureCard";


export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-xl font-semibold text-white">Focused capabilities</h2>
      <p className="mt-1 text-sm text-slate-300">
        Minimal feature set. Maximum clarity.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<ClipboardIcon className="h-5 w-5" />}
          title="Intake basics"
          desc="Collects name, age, symptoms, allergies, meds—nothing more."
        />
        <FeatureCard
          icon={<ChatIcon className="h-5 w-5" />}
          title="Simple UX"
          desc="Chat-first flow with clear prompts and minimal friction."
        />
        <FeatureCard
          icon={<SparkIcon className="h-5 w-5" />}
          title="Local demo"
          desc="No external APIs by default. Easy to swap in a real backend later."
        />
        <FeatureCard
          icon={<ShieldIcon className="h-5 w-5" />}
          title="Privacy-aware"
          desc="Material-like surfaces, sensible defaults, and least data retained."
        />
      </div>
    </section>
  );
}
