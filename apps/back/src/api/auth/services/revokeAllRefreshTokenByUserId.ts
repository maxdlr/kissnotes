import type { Id } from "@kissnotes/types";
import type RefreshTokenEntity from "@/entities/RefreshTokenEntity";
import RefreshTokenRepository from "@/repositories/RefreshTokenRepository";

const revokeAllRefreshTokenByUserId = async (
	userId: Id,
	reason: RefreshTokenEntity["revokedReason"],
) => {
	if (!userId) {
		throw ApiError("User ID is required to revoke refresh tokens");
	}

	if (!reason) {
		throw ApiError("Reason is required to revoke refresh tokens");
	}

	return await RefreshTokenRepository.update(
		{ userId: userId as number },
		{
			revokedOn: new Date(),
			revokedReason: reason,
		},
	);
};

export default revokeAllRefreshTokenByUserId;
