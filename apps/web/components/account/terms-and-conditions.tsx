/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import Link from "next/link";
import { EAuthModes } from "@plane/constants";

interface TermsAndConditionsProps {
  authType?: EAuthModes;
}

// Constants for better maintainability
const LEGAL_LINKS = {
  termsOfService: "https://plane.so/legals/terms-and-conditions",
  privacyPolicy: "https://plane.so/legals/privacy-policy",
} as const;

const MESSAGES = {
  [EAuthModes.SIGN_UP]: "注册即表示您理解并同意",
  [EAuthModes.SIGN_IN]: "登录即表示您理解并同意",
} as const;

// Reusable link component to reduce duplication
function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-secondary" target="_blank" rel="noopener noreferrer">
      <span className="text-body-xs-medium underline hover:cursor-pointer">{children}</span>
    </Link>
  );
}

export function TermsAndConditions({ authType = EAuthModes.SIGN_IN }: TermsAndConditionsProps) {
  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-body-xs-regular whitespace-pre-line text-tertiary">
        {`${MESSAGES[authType]}我们的`}
        <LegalLink href={LEGAL_LINKS.termsOfService}>《服务条款》</LegalLink>和
        <LegalLink href={LEGAL_LINKS.privacyPolicy}>《隐私政策》</LegalLink>。
      </p>
    </div>
  );
}
