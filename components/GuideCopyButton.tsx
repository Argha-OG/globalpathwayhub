'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/share';
import toast from 'react-hot-toast';
import { FaCheck, FaCopy } from 'react-icons/fa6';

export default function GuideCopyButton({
  title,
  excerpt,
}: {
  title: string;
  excerpt: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `*${title}*\nGlobalPathwayHub Student Survival Guide\n${excerpt}\nRead more: ${shareUrl}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success('Copied guide link for WhatsApp!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopyShare}
      className="h-8 px-3 rounded-lg text-xs font-bold border-[#144272]/25 text-[#144272] gap-1.5"
    >
      {copied ? <FaCheck className="h-3 w-3 text-[#3FC1C9]" /> : <FaCopy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy Link'}
    </Button>
  );
}
