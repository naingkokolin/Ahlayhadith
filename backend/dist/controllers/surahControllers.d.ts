import { Request, Response } from "express";
export declare const getAllSurahs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addSurah: (req: Request, res: Response) => Promise<void>;
export declare const getSurahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSurahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSurahById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=surahControllers.d.ts.map