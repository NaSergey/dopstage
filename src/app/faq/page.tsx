"use client";

import { Accordion } from "@/app/faq/components/accordion";
import Logo from "@/widgets/header/components/logo";
import Wrapper from "@/shared/ui/wrapper";

const faqData = [
  {
    id: "what-is-dopamine",
    question: "What is App?",
    answer:
      "App is a social crypto platform that lets you earn tokens by creating tweets, engaging with communities, and participating in the ecosystem. Think of it as a social network where your engagement and influence have real, monetizable value.",
  },
  {
    id: "create-account",
    question: "How do I create an App account?",
    answer:
      "You can sign up with your wallet or twitter. You'll then be able to create tweets, engage with the community, and start earning DOP tokens through your participation.",
  },
  {
    id: "crypto-knowledge",
    question: "Do I need to know about crypto to use App?",
    answer:
      "App is designed for everyone. We provide simple instructions and an intuitive interface that makes crypto accessible to users regardless of their technical background.",
  },
  {
    id: "get-dop-tokens",
    question: "How do I get DOP tokens?",
    answer:
      "You can earn DOP tokens by: Creating popular tweets, engaging with community tweets through likes and comments, participating in community events, and referring new users to the platform.",
  },
  {
    id: "supported-cryptocurrencies",
    question: "What cryptocurrencies does App support?",
    answer:
      "App primarily uses DOP tokens, but we support integration with major cryptocurrencies including Bitcoin, Ethereum, and other popular altcoins for transactions and rewards.",
  },
  {
    id: "transaction-speed",
    question: "Why is my transaction taking so long?",
    answer:
      "Transaction times depend on network congestion and the blockchain being used. We're constantly working to optimize our infrastructure to provide faster transaction processing.",
  },
  {
    id: "transaction-fees",
    question: "Are there any fees for transactions?",
    answer:
      "Minimal transaction fees apply to cover network costs. These fees are clearly displayed before you confirm any transaction, ensuring full transparency.",
  },
  {
    id: "security",
    question: "How does App keep my account and funds secure?",
    answer:
      "We use industry-standard security measures including encryption, secure wallet integration, and regular security audits to protect your account and digital assets.",
  },
  {
    id: "compromised-account",
    question: "What if my account has been compromised?",
    answer:
      "If you suspect your account has been compromised, immediately contact our support team and change your passwords. We have security protocols in place to help recover and secure your account.",
  },
  {
    id: "algorithm",
    question: "How does the algorithm decide who earns DOPs?",
    answer:
      "Our algorithm considers various factors including tweet quality, engagement metrics, community interaction, and user behavior to fairly distribute DOP token rewards across the platform.",
  },
  {
    id: "contact-support",
    question: "How do I contact Dopers Support?",
    answer:
      "The best way to get help is through the Support Center inside the platform, or you can reach out to our community managers on our official social media channels.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="py-3 w-full">
        <Wrapper>
          <div className="flex items-center">
            <Logo />
          </div>
        </Wrapper>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-normal text-white">FAQ</h1>
        </div>

        {/* FAQ accordion */}
        <Accordion
          items={faqData}
          defaultOpenId="what-is-dopaminer"
          className="space-y-0"
        />
      </div>
    </div>
  );
}
