/*
  Warnings:

  - You are about to drop the column `horario` on the `Brecho` table. All the data in the column will be lost.
  - You are about to drop the column `localizacao` on the `Brecho` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brecho" DROP COLUMN "horario",
DROP COLUMN "localizacao",
ADD COLUMN     "atendimento" TEXT,
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "capaUrl" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "emailContato" TEXT,
ADD COLUMN     "entrega" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "formasPagamento" TEXT[],
ADD COLUMN     "horarios" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "negociacao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "retirada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rua" TEXT,
ADD COLUMN     "site" TEXT,
ADD COLUMN     "telefone" TEXT;
