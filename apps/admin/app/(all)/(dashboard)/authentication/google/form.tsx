/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { isEmpty } from "lodash-es";
// plane internal packages
import { API_BASE_URL } from "@plane/constants";
import type { IFormattedInstanceConfiguration, TInstanceGoogleAuthenticationConfigurationKeys } from "@plane/types";
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

type GoogleConfigFormValues = Record<TInstanceGoogleAuthenticationConfigurationKeys, string>;

const GOOGLE_FORM_SWITCH_FIELD: TControllerSwitchFormField<GoogleConfigFormValues> = {
  name: "ENABLE_GOOGLE_SYNC",
  label: "Google",
};

export function InstanceGoogleConfigForm(props: Props) {
  const { config } = props;
  // form data
  const {
    control,
    formState: { errors },
    onSave,
  } = useOAuthProviderConfigForm<GoogleConfigFormValues>("Google", {
    GOOGLE_CLIENT_ID: config["GOOGLE_CLIENT_ID"],
    GOOGLE_CLIENT_SECRET: config["GOOGLE_CLIENT_SECRET"],
    ENABLE_GOOGLE_SYNC: config["ENABLE_GOOGLE_SYNC"] || "0",
  });

  const originURL = !isEmpty(API_BASE_URL) ? API_BASE_URL : typeof window !== "undefined" ? window.location.origin : "";

  const GOOGLE_FORM_FIELDS: TControllerInputFormField<GoogleConfigFormValues>[] = [
    {
      key: "GOOGLE_CLIENT_ID",
      type: "text",
      label: "客户端 ID",
      description: (
        <>
          您的客户端 ID 位于 Google API 控制台中。
          <a
            href="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#creatingcred"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label="Google OAuth 客户端 ID 文档"
          >
            了解更多
          </a>
        </>
      ),
      placeholder: "840195096245-0p2tstej9j5nc4l8o1ah2dqondscqc1g.apps.googleusercontent.com",
      error: Boolean(errors.GOOGLE_CLIENT_ID),
      required: true,
    },
    {
      key: "GOOGLE_CLIENT_SECRET",
      type: "password",
      label: "客户端密钥",
      description: (
        <>
          您的客户端密钥同样位于 Google API 控制台中。
          <a
            href="https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label="Google OAuth 客户端密钥文档"
          >
            了解更多
          </a>
        </>
      ),
      placeholder: "GOCShX-ADp4cI0kPqav1gGCBg5bE02E",
      error: Boolean(errors.GOOGLE_CLIENT_SECRET),
      required: true,
    },
  ];

  const GOOGLE_COMMON_SERVICE_DETAILS: TCopyField[] = [
    {
      key: "Origin_URL",
      label: "来源 URL",
      url: originURL,
      description: (
        <p>
          此值会自动生成，请将其填入您的 <CodeBlock darkerShade>Authorized JavaScript origins</CodeBlock> 字段。该 OAuth
          客户端的凭据可在
          <a
            href="https://console.cloud.google.com/apis/credentials/oauthclient"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label="Google Cloud Console OAuth 客户端凭据"
          >
            此处获取。
          </a>
        </p>
      ),
    },
  ];

  const GOOGLE_SERVICE_DETAILS: TCopyField[] = [
    {
      key: "Callback_URI",
      label: "回调地址",
      url: `${originURL}/auth/google/callback/`,
      description: (
        <p>
          此值会自动生成，请将其填入您的 <CodeBlock darkerShade>Authorized Redirect URI</CodeBlock> 字段。该 OAuth
          客户端的凭据可在
          <a
            href="https://console.cloud.google.com/apis/credentials/oauthclient"
            target="_blank"
            className="text-accent-primary hover:underline"
            rel="noreferrer"
            aria-label="Google Cloud Console OAuth 客户端凭据"
          >
            此处获取。
          </a>
        </p>
      ),
    },
  ];

  return (
    <OAuthProviderForm
      providerName="Google"
      control={control}
      formFields={GOOGLE_FORM_FIELDS}
      switchField={GOOGLE_FORM_SWITCH_FIELD}
      onSave={onSave}
      serviceDetails={GOOGLE_COMMON_SERVICE_DETAILS}
      webServiceDetails={GOOGLE_SERVICE_DETAILS}
    />
  );
}
