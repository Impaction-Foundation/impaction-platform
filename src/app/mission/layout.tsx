import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impaction - Our Mission",
  description:
    "Join Impaction in our mission to combat climate change through innovative carbon offset solutions and sustainable practices.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Impaction - Our Mission",
    description:
      "Join Impaction in our mission to combat climate change through innovative carbon offset solutions and sustainable practices.",
    url: "https://impaction.global",
    siteName: "Impaction",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impaction - Our Mission",
    description:
      "Join Impaction in our mission to combat climate change through innovative carbon offset solutions and sustainable practices.",
  },
  alternates: {
    canonical: "https://impaction.global/mission",
  },
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
