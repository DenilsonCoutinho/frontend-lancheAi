import { db as prisma } from "@/lib/db";

export const verificationEstablishmentExist = async (idEstablishment: string) => {
	const establishmentExist = await prisma.establishment.findFirst({
		where: {
			idEstablishment
		},
	});
	return establishmentExist;
};