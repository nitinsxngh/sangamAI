import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  RocketIcon,
  LockClosedIcon,
  ChatBubbleIcon,
  MagicWandIcon,
  DesktopIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";

const features = [
  {
    Icon: RocketIcon,
    name: "One-Click Setup",
    description: "Launch your AI chatbot in seconds—no coding, no technical setup, just plug and play.",
    href: "/generate",
    cta: "Try it now",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: MagicWandIcon,
    name: "Auto-Training & Revision",
    description: "Sangam AI continuously learns and improves without any manual updates or data input.",
    href: "/generate",
    cta: "See how it learns",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: LockClosedIcon,
    name: "Secure & Private",
    description: "Your data stays secure and private. Sangam never stores or shares your content.",
    href: "/generate",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ChatBubbleIcon,
    name: "Natural Conversations",
    description: "Deliver lifelike, intelligent chat experiences powered by advanced conversational AI.",
    href: "/generate",
    cta: "Chat with Sangam",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: DesktopIcon,
    name: "Minimal Maintenance",
    description: "Set it once and forget it. Sangam runs on autopilot, requiring zero ongoing effort.",
    href: "/generate",
    cta: "Effortless AI",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Pencil2Icon,
    name: "Customizable Themes",
    description: "Multiple themes and color options to perfectly match your brand and website design.",
    href: "/generate",
    cta: "Preview styles",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
];

export async function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
