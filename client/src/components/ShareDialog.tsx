import { useState } from "react";
import {
  Share2,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShare } from "@/hooks/useShare";

interface ShareDialogProps {
  title: string;
  text: string;
  url: string;
  triggerLabel?: string;
}

export function ShareDialog({
  title,
  text,
  url,
  triggerLabel = "SHARE",
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const {
    copyToClipboard,
    shareViaWebShare,
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToReddit,
  } = useShare();

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url, "Link");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    await shareViaWebShare({ title, text, url });
  };

  const handleTwitterShare = () => {
    shareToTwitter(`${text} ${url}`, url);
  };

  const handleFacebookShare = () => {
    shareToFacebook(url);
  };

  const handleLinkedInShare = () => {
    shareToLinkedIn(url, title);
  };

  const handleRedditShare = () => {
    shareToReddit(url, title);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none border-2 border-border font-mono text-xs hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4 mr-1" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none border-2 border-border shadow-hard max-w-md">
        <DialogHeader className="border-b-2 border-border pb-4">
          <DialogTitle className="text-lg font-bold uppercase">
            Share This
          </DialogTitle>
          <DialogDescription className="font-mono text-sm mt-2">
            {title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Link Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">
              Share Link
            </h4>
            <div className="flex gap-2">
              <Input
                type="text"
                value={url}
                readOnly
                className="rounded-none border-2 border-border font-mono text-xs flex-1"
              />
              <Button
                onClick={handleCopyLink}
                className={`rounded-none border-2 ${
                  copied
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border bg-card hover:bg-accent/20"
                } font-mono text-xs font-bold`}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3 border-t-2 border-border pt-4">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">
              Share to Social Media
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <Button
                  onClick={handleWebShare}
                  className="rounded-none border-2 border-border bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  SHARE
                </Button>
              )}
              <Button
                onClick={handleTwitterShare}
                className="rounded-none border-2 border-border bg-blue-400 hover:bg-blue-500 text-white font-mono text-xs font-bold"
              >
                <Twitter className="h-4 w-4 mr-1" />
                TWITTER
              </Button>
              <Button
                onClick={handleFacebookShare}
                className="rounded-none border-2 border-border bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold"
              >
                <Facebook className="h-4 w-4 mr-1" />
                FACEBOOK
              </Button>
              <Button
                onClick={handleLinkedInShare}
                className="rounded-none border-2 border-border bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                LINKEDIN
              </Button>
              <Button
                onClick={handleRedditShare}
                className="rounded-none border-2 border-border bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs font-bold"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                REDDIT
              </Button>
              <Button
                onClick={() => {
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`;
                  window.location.href = mailtoLink;
                }}
                className="rounded-none border-2 border-border bg-gray-500 hover:bg-gray-600 text-white font-mono text-xs font-bold"
              >
                <Mail className="h-4 w-4 mr-1" />
                EMAIL
              </Button>
            </div>
          </div>

          {/* Message Template */}
          <div className="space-y-3 border-t-2 border-border pt-4">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">
              Message Template
            </h4>
            <div className="bg-muted/10 border border-border/20 p-3 rounded-none font-mono text-xs text-foreground/80 leading-relaxed break-words">
              {text}
            </div>
          </div>

          {/* Info */}
          <div className="bg-accent/20 border-2 border-border p-3 rounded-none text-xs font-mono text-foreground/80">
            <p>✓ Share your findings with the sneaker community</p>
            <p>✓ Help others discover great sneaker deals</p>
            <p>✓ Spread the word about Sneaker Matrix</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
