import { Asset } from "./asset";

export class JsonAsset extends Asset {
    json: Record<string, any> | null;
}
