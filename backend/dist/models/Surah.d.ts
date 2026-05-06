import mongoose, { Document } from "mongoose";
export interface ISurah extends Document {
    surah_number: number;
    name_ar: string;
    name_mm: string;
    name_en: string;
    totalAyah: number;
}
declare const Surah: mongoose.Model<ISurah, {}, {}, {}, mongoose.Document<unknown, {}, ISurah, {}, mongoose.DefaultSchemaOptions> & ISurah & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISurah>;
export default Surah;
//# sourceMappingURL=Surah.d.ts.map