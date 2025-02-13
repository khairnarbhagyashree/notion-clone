"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { BotIcon, Languages, LanguagesIcon } from "lucide-react";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { useState, useTransition } from "react";
import Markdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Language =
  | "english"
  | "spanish"
  | "portugese"
  | "french"
  | "arabic"
  | "hindi"
  | "marathi";

const languages: Language[] = [
  "english",
  "spanish",
  "portugese",
  "french",
  "arabic",
  "hindi",
  "marathi",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Translated Summary successfully!");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          {summary && (
            <div className="felx flex-col items-start max-h-96 overflow-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-bold">
                  GPT {isPending ? "is thinking..." : "Says:"}
                </p>
              </div>
              <p>
                {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
              </p>
            </div>
          )}
          <DialogTitle>Translate the document!</DialogTitle>
          <DialogDescription>
            Select a language and AI will translate a summary of the document in
            the selected language.
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q:{question}</p>}
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default TranslateDocument;
