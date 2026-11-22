/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useRouter } from "next/navigation";
// plane imports
import { ConfirmDialog } from "@plane/blocks/dialog";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  onDiscardHref: string;
};

export function ConfirmDiscardModal(props: Props) {
  const { isOpen, handleClose, onDiscardHref } = props;
  // router
  const router = useRouter();

  // The confirm used to be a `<Link href={onDiscardHref}>`; ConfirmDialog's confirm is a button, so
  // it navigates through the router instead.
  const handleSubmit = () => {
    try {
      router.push(onDiscardHref);
    } catch (error) {
      console.error("放弃更改并返回失败：", error);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      isSubmitting={false}
      variant="primary"
      hideIcon
      title="您有未保存的更改"
      content="返回将丢失您所做的更改，确定要返回吗？"
      primaryButtonText={{ default: "返回" }}
      secondaryButtonText="继续编辑"
    />
  );
}
