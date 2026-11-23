/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// helpers
import { EAuthModes } from "@/types/auth";

type TAuthHeader = {
  authMode: EAuthModes;
};

type TAuthHeaderContent = {
  header: string;
  subHeader: string;
};

type TAuthHeaderDetails = {
  [mode in EAuthModes]: TAuthHeaderContent;
};

const Titles: TAuthHeaderDetails = {
  [EAuthModes.SIGN_IN]: {
    header: "登录后即可点赞或评论",
    subHeader: "用您的意见推动想要的功能落地。",
  },
  [EAuthModes.SIGN_UP]: {
    header: "查看、评论，做更多事",
    subHeader: "注册或登录后即可参与 Plane 工作项与页面的协作。",
  },
};

export function AuthHeader(props: TAuthHeader) {
  const { authMode } = props;

  const getHeaderSubHeader = (mode: EAuthModes | null): TAuthHeaderContent => {
    if (mode) {
      return Titles[mode];
    }

    return {
      header: "评论或对工作项表态",
      subHeader: "用 Plane 为功能补充您的宝贵意见。",
    };
  };

  const { header, subHeader } = getHeaderSubHeader(authMode);

  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="text-h4-semibold text-primary">{header}</span>
        <span className="text-h4-semibold text-placeholder">{subHeader}</span>
      </div>
    </>
  );
}
