import { DentalTherapySchema, DentalTherapyWithRelationsSchema } from "prisma/generated";
import { generateMock } from "@anatine/zod-mock";
import fs from "fs";

const mock = generateMock(DentalTherapySchema);

fs.writeFileSync("example.json", JSON.stringify(mock, null, 2));
