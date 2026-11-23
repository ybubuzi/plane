/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Link } from "react-router";
// plane imports
import { Button } from "@makeplane/propel/components/button";
import { EmptyStateDetailed } from "@plane/blocks/empty-state";

function PageNotFound() {
  return (
    <div className="h-screen w-full overflow-hidden bg-surface-1 p-4">
      <EmptyStateDetailed
        align="center"
        assetKey="error-404"
        assetClassName="size-40"
        title="页面出错了。"
        description="抱歉，您访问的页面不存在。它可能已被删除、重命名，或暂时无法访问。"
        customButton={
          <Button
            variant="primary"
            size="lg"
            stretch="auto"
            nativeButton={false}
            render={<Link to="/general/" />}
            label="前往通用设置"
          />
        }
      />
    </div>
  );
}

export default PageNotFound;
