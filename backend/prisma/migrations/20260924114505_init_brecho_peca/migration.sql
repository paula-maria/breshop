-- CreateTable
CREATE TABLE "Brecho" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "instagram" TEXT,
    "horario" TEXT,
    "descricao" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brecho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "tamanho" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "condicao" TEXT NOT NULL,
    "fotos" TEXT[],
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "brechoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brecho_userId_key" ON "Brecho"("userId");

-- AddForeignKey
ALTER TABLE "Brecho" ADD CONSTRAINT "Brecho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peca" ADD CONSTRAINT "Peca_brechoId_fkey" FOREIGN KEY ("brechoId") REFERENCES "Brecho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
