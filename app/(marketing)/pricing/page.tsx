"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/more-icons";
import ShinyButton from "@/components/magicui/shiny-button";

// ✅ Custom Toggle Switch Component
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const plans = [
    {
      name: "Basic",
      monthly: 19,
      yearly: 171, // 10% off yearly
      features: [
        "Easy Setup",
        "Good Theme Choices",
        "Simple Features",
        "Manual Data Load",
        "Up to 1,000 Messages",
        "Basic Support",
      ],
    },
    {
      name: "Pro",
      monthly: 39,
      yearly: 351, // 10% off yearly
      features: [
        "Easy Setup",
        "Good Theme Choices",
        "Simple Features",
        "Auto Data Load",
        "Up to 5,000 Messages",
        "Basic Custom Flow Integration",
        "Removed Branding",
        "Basic Support",
      ],
    },
    {
      name: "Enterprise",
      monthly: 59,
      yearly: 531, // 10% off yearly
      features: [
        "Easy Setup",
        "Good Theme Choices",
        "Simple Features",
        "Auto Data Load",
        "Up to 10,000 Messages",
        "Custom Flow Integration",
        "Dedicated Support",
        "Removed Branding",
        "Own Logo Integration",
      ],
    },
  ];

  const handleCheckout = async (plan: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan, billingCycle }),
    });

    const { url } = await res.json();

    if (url) {
      window.location.href = url;
    } else {
      console.error("Checkout failed");
    }
  };

  return (
    <section className="container flex flex-col gap-10 py-10 md:max-w-[64rem] md:py-12 lg:py-20">
      <div className="mx-auto flex flex-col gap-4 md:max-w-[58rem] text-center">
        <h2 className="font-heading text-3xl sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground sm:text-lg">
          Pick a plan that fits your scale. Cancel anytime.
        </p>

        <div className="flex justify-center items-center gap-3 mt-4">
          <span className="text-sm text-muted-foreground">Monthly</span>
          <ToggleSwitch
            checked={billingCycle === "yearly"}
            onChange={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
          />
          <span className="text-sm text-muted-foreground">Yearly (10% off)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col justify-between rounded-xl border p-6 shadow-md"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-5xl font-bold">
                $
                {billingCycle === "monthly"
                  ? plan.monthly
                  : plan.yearly}
              </p>
              <p className="text-sm text-muted-foreground">
                Billed {billingCycle === "monthly" ? "Monthly" : "Yearly"}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Icons.check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleCheckout(plan.name)}
                className="w-full"
              >
                <ShinyButton text="Get Started" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[58rem] text-center text-muted-foreground text-sm mt-4">
        SangamAI gives free demo. <strong>You can test it first and won&apos;t be charged.</strong>
      </div>
    </section>
  );
}
