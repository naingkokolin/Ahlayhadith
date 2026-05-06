import { Request, Response } from "express";
export declare const getAllAyahs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addAyah: (req: Request, res: Response) => Promise<void>;
export declare const getAyahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAyahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAyahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ayahControllers.d.ts.map