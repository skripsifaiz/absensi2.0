"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrectionController = void 0;
const common_1 = require("@nestjs/common");
const correction_service_1 = require("./correction.service");
let CorrectionController = class CorrectionController {
    correctionService;
    constructor(correctionService) {
        this.correctionService = correctionService;
    }
    async submitCorrection(body) {
        return this.correctionService.submitCorrection(body);
    }
    async getPendingWitnessCorrections(witnessId) {
        return this.correctionService.getPendingWitnessCorrections(witnessId);
    }
    async witnessApprove(id, action, notes) {
        return this.correctionService.witnessApprove(id, action, notes);
    }
    async getAdminCorrections() {
        return this.correctionService.getAdminCorrections();
    }
    async adminApprove(id, action, notes) {
        return this.correctionService.adminApprove(id, action, notes);
    }
};
exports.CorrectionController = CorrectionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CorrectionController.prototype, "submitCorrection", null);
__decorate([
    (0, common_1.Get)('pending-witness'),
    __param(0, (0, common_1.Query)('witnessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CorrectionController.prototype, "getPendingWitnessCorrections", null);
__decorate([
    (0, common_1.Patch)(':id/witness-approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('action')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CorrectionController.prototype, "witnessApprove", null);
__decorate([
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CorrectionController.prototype, "getAdminCorrections", null);
__decorate([
    (0, common_1.Patch)(':id/admin-approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('action')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CorrectionController.prototype, "adminApprove", null);
exports.CorrectionController = CorrectionController = __decorate([
    (0, common_1.Controller)('correction'),
    __metadata("design:paramtypes", [correction_service_1.CorrectionService])
], CorrectionController);
//# sourceMappingURL=correction.controller.js.map