import {
  Microscope, FlaskConical, Globe, Calculator,
  HeartPulse, Zap, Stethoscope, TestTube,
  BookOpen, Beaker, Atom, Brain, Activity,
  Leaf, Mountain, Wind, Package
} from "lucide-react";

export const CATEGORY_ICONS = {
  Microscope,
  FlaskConical,
  Globe,
  Calculator,
  HeartPulse,
  Zap,
  Stethoscope,
  TestTube,
  BookOpen,
  Atom,
  Brain,
  Activity,
  Leaf,
  Mountain,
  Wind,
  Package,
};

export function getCategoryIcon(iconName) {
  return CATEGORY_ICONS[iconName] || Package;
}