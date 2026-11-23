/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { isEmpty } from "lodash-es";
import { useWatch } from "react-hook-form";
// plane internal packages
import { API_BASE_URL } from "@plane/constants";
import type { IFormattedInstanceConfiguration, TInstanceGiteaAuthenticationConfigurationKeys } from "@plane/types";
// components
import { CodeBlock } from "@/components/common/code-block";
import type { TControllerInputFormField } from "@/components/common/controller-input";
import type { TControllerSwitchFormField } from "@/components/common/controller-switch";
import type { TCopyField } from "@/components/common/copy-field";
import { OAuthProviderForm } from "@/components/authentication/oauth-provider-form";
// hooks
import { useOAuthProviderConfigForm } from "@/hooks/use-oauth-provider-config-form";

type Props = {
  config: IFormattedInstanceConfiguration;
};

type GiteaConfigFormValues = Record<TInstanceGiteaAuthenticationConfigurationKeys, string>;

const GITEA_FORM_SWITCH_FIELD: TControllerSwitchFormField<GiteaConfigFormValues> = {
  name: "ENABLE_GITEA_SYNC",
  label: "Gitea",
};

export function InstanceGiteaConfigForm(props: Props) {
  const { config } = props;
  // form data
  const {
    control,
    formState: { errors },
    onSave,
  } = useOAuthProviderConfigForm<GiteaConfigFormValues>("Gitea", {
    GITEA_HOST: config["GITEA_HOST"] || "https://gitea.com",
    GITEA_CLIENT_ID: config["GITEA_CLIENT_ID"],
    GITEA_CLIENT_SECRET: config["GITEA_CLIENT_SECRET"],
    ENABLE_GITEA_SYNC: config["ENABLE_GITEA_SYNC"] || "0",
  });
  // subscribed so the settings link follows host edits
  const giteaHost = useWatch({ control, name: "GITEA_HOST" });

  const originURL = !isEmpty(API_BASE_URL) ? API_BASE_URL : typeof window !== "undefined" ? window.location.origin : "";

  const GITEA_FORM_FIELDS: TControllerInputFormField<GiteaConfigFormValues>[] = [
    {
      key: "GITEA_HOST",
      type: "text",
      label: "Gitea 主机",
      description: <>填写您的 Gitea 实例地址。若使用官方实例，请填写 &quot;https://gitea.com&quot;。</>,
      placeholder: "https://gitea.com",
      error: Boolean(errors.GITEA_HOST),
      required: true,
    },
    {
      key: "GITEA_CLIENT_ID",
      type: "text",
      label: "客户端 ID",
      description: (
        <>
          请前往{" "}
          <a
            href="https://gitea.com/user/settings/applications"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
          >
            Gitea OAuth 应用设置
          </a>
          中获取。
        </>
      ),
      placeholder: "70a44354520df8bd9bcd",
      error: Boolean(errors.GITEA_CLIENT_ID),
      required: true,
    },
    {
      key: "GITEA_CLIENT_SECRET",
      type: "password",
      label: "客户端密钥",
      description: (
        <>
          客户端密钥同样可以在{" "}
          <a
            href="https://gitea.com/user/settings/applications"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
          >
            Gitea OAuth 应用设置
          </a>
          中获取。
        </>
      ),
      placeholder: "9b0050f94ec1b744e32ce79ea4ffacd40d4119cb",
      error: Boolean(errors.GITEA_CLIENT_SECRET),
      required: true,
    },
  ];

  const GITEA_SERVICE_FIELD: TCopyField[] = [
    {
      key: "Callback_URI",
      label: "回调地址",
      url: `${originURL}/auth/gitea/callback/`,
      description: (
        <>
          此值会自动生成，请将其填入 <CodeBlock darkerShade>Authorized Callback URI</CodeBlock> 字段。可前往{" "}
          <a
            href={`${giteaHost || "https://gitea.com"}/user/settings/applications`}
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label="Gitea OAuth 应用设置"
          >
            Gitea OAuth 应用设置
          </a>
          处设置回调地址。
        </>
      ),
    },
  ];

  return (
    <OAuthProviderForm
      providerName="Gitea"
      control={control}
      formFields={GITEA_FORM_FIELDS}
      switchField={GITEA_FORM_SWITCH_FIELD}
      onSave={onSave}
      serviceDetails={GITEA_SERVICE_FIELD}
    />
  );
}
