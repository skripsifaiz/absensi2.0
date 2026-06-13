import { PrismaService } from '../infrastructure/prisma/prisma.service';
export declare class CorrectionService {
    private prisma;
    constructor(prisma: PrismaService);
    submitCorrection(data: {
        userId: string;
        date: string;
        correctionType: string;
        reason: string;
        verificationMethod: string;
        witnessId?: string;
        photoUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CorrectionStatus;
        userId: string;
        date: Date;
        correctionType: import("@prisma/client").$Enums.CorrectionType;
        reason: string;
        verificationMethod: import("@prisma/client").$Enums.VerificationMethod;
        photoUrl: string | null;
        reviewNotes: string | null;
        witnessId: string | null;
    }>;
    getPendingWitnessCorrections(witnessId: string): Promise<({
        user: {
            id: string;
            name: string;
            nip: string;
            position: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CorrectionStatus;
        userId: string;
        date: Date;
        correctionType: import("@prisma/client").$Enums.CorrectionType;
        reason: string;
        verificationMethod: import("@prisma/client").$Enums.VerificationMethod;
        photoUrl: string | null;
        reviewNotes: string | null;
        witnessId: string | null;
    })[]>;
    witnessApprove(correctionId: string, action: 'APPROVE' | 'REJECT', notes?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CorrectionStatus;
        userId: string;
        date: Date;
        correctionType: import("@prisma/client").$Enums.CorrectionType;
        reason: string;
        verificationMethod: import("@prisma/client").$Enums.VerificationMethod;
        photoUrl: string | null;
        reviewNotes: string | null;
        witnessId: string | null;
    }>;
    getAdminCorrections(): Promise<({
        user: {
            id: string;
            name: string;
            nip: string;
            position: string | null;
        };
        witness: {
            id: string;
            name: string;
            position: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CorrectionStatus;
        userId: string;
        date: Date;
        correctionType: import("@prisma/client").$Enums.CorrectionType;
        reason: string;
        verificationMethod: import("@prisma/client").$Enums.VerificationMethod;
        photoUrl: string | null;
        reviewNotes: string | null;
        witnessId: string | null;
    })[]>;
    adminApprove(correctionId: string, action: 'APPROVE' | 'REJECT', notes?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CorrectionStatus;
        userId: string;
        date: Date;
        correctionType: import("@prisma/client").$Enums.CorrectionType;
        reason: string;
        verificationMethod: import("@prisma/client").$Enums.VerificationMethod;
        photoUrl: string | null;
        reviewNotes: string | null;
        witnessId: string | null;
    }>;
}
