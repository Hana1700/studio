import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Le mot de passe actuel est incorrect' }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { username },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
