import type {AppMiddleware, Request, Response} from '@gravity-ui/expresskit';
import type {AppContext} from '@gravity-ui/nodekit';

import type {Entry, UpdateEntryRequest} from '../../../shared';
import {EntryScope, EntryUpdateMode} from '../../../shared';
import type {ExtendedAppRouteDescription} from '../../types/controllers';
import Utils from '../../utils';
import {US} from '../sdk';

export function getChartEngineAPIRoutes({
    ctx,
    beforeAuth,
    afterAuth,
}: {
    ctx: AppContext;
    beforeAuth: AppMiddleware[];
    afterAuth: AppMiddleware[];
}) {
    const routes: Record<string, ExtendedAppRouteDescription> = {
        enableIsolatedSandbox: {
            beforeAuth,
            afterAuth,
            route: 'POST /enableIsolatedSandbox/:entryId',
            handler: async (req: Request, res: Response) => {
                const entryId = req.params.entryId;
                const headers = Utils.pickHeaders(req);
                const headersWithMetadata = {
                    ...headers,
                    ...ctx.getMetadata(),
                };
                const result = await US.readEntry(entryId, null, headersWithMetadata, ctx);
                if (result.scope === EntryScope.Widget) {
                    const meta = {...result.meta, isolatedSanbox: true};
                    const updateData = {
                        revId: result.revId,
                        meta,
                    } as unknown as UpdateEntryRequest<Entry>;

                    const updatedEntry = await US.updateEntry(
                        entryId,
                        EntryUpdateMode.Save,
                        updateData,
                        headers,
                        ctx,
                    );
                    res.end(JSON.stringify(updatedEntry));
                } else {
                    res.end(`Wrong entity scope "${result.scope}"`);
                }
            },
        },
        disableIsolatedSandbox: {
            beforeAuth,
            afterAuth,
            route: 'POST /disableIsolatedSandbox/:entryId',
            handler: async (req: Request, res: Response) => {
                const entryId = req.params.entryId;
                const headers = Utils.pickHeaders(req);
                const headersWithMetadata = {
                    ...headers,
                    ...ctx.getMetadata(),
                };
                const result = await US.readEntry(entryId, null, headersWithMetadata, ctx);
                if (result.scope === EntryScope.Widget) {
                    const meta = {...result.meta, isolatedSanbox: false};
                    const updateData = {
                        revId: result.revId,
                        meta,
                    } as unknown as UpdateEntryRequest<Entry>;

                    const updatedEntry = await US.updateEntry(
                        entryId,
                        EntryUpdateMode.Save,
                        updateData,
                        headers,
                        ctx,
                    );
                    res.end(JSON.stringify(updatedEntry));
                } else {
                    res.end(`Wrong entity scope "${result.scope}"`);
                }
            },
        },
    };

    return routes;
}
