import mongoose, { Document } from "mongoose";
export interface IAyah extends Document {
    surah: mongoose.Types.ObjectId;
    ayah_number: number;
    text_ar: string;
    text_mm: string;
}
declare const Ayah: mongoose.Model<IAyah, {}, {}, {}, mongoose.Document<unknown, {}, IAyah, {}, mongoose.DefaultSchemaOptions> & IAyah & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAyah>;
export default Ayah;
//# sourceMappingURL=Ayah.d.ts.map