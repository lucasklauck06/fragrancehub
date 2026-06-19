import "dotenv/config"; // <-- ADICIONE ESTA LINHA AQUI
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const emailAdmin = "lucassk56@gmail.com"; // Coloque aqui o E-MAIL real
  const novaSenhaLimpa = "123456"; // Nova senha

  try {
    const hashedPassword = await bcrypt.hash(novaSenhaLimpa, 10);

    const user = await prisma.user.update({
      where: {
        email: emailAdmin,
      },
      data: {
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`✅ Senha do admin (${user.email}) atualizada com sucesso!`);
    console.log(`🔑 Nova senha configurada: ${novaSenhaLimpa}`);
  } catch (error) {
    if ((error as any).code === "P2025") {
      console.error(
        `❌ O email ${emailAdmin} não foi encontrado no banco de dados.`,
      );
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
