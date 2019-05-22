<?php

namespace App\Security\Voter;

use App\Entity\System\File;
use App\Entity\System\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PrivateFileVoter extends Voter
{
    private const VIEW = 'view';

    protected function supports($attribute, $subject): bool
    {
        if ($attribute !== self::VIEW) {
            return false;
        }

        if (!$subject instanceof File) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if ($user->hasRole(User::ROLE_ADMIN) || $user->hasRole(User::ROLE_LECTURER)) {
            return true;
        }

        /** @var File $file */
        $file = $subject;

        return $attribute === self::VIEW && $file->getUser()->getId() === $user->getId();
    }
}
