/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

type Props = {
  isSignUp?: boolean;
};

export function TermsAndConditions(props: Props) {
  const { isSignUp = false } = props;
  return (
    <span className="flex items-center justify-center py-6">
      <p className="text-center text-body-xs-regular whitespace-pre-line text-secondary">
        {isSignUp ? "注册即表示您同意" : "登录即表示您同意"}我们的{"\n"}
        <a href="https://plane.so/legals/terms-and-conditions" target="_blank" rel="noopener noreferrer">
          <span className="text-body-xs-medium underline hover:cursor-pointer">《服务条款》</span>
        </a>和
        <a href="https://plane.so/legals/privacy-policy" target="_blank" rel="noopener noreferrer">
          <span className="text-body-xs-medium underline hover:cursor-pointer">《隐私政策》</span>
        </a>
        {"。"}
      </p>
    </span>
  );
}
