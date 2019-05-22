<?php

namespace App\Service\Traits;

use App\Entity\System\File;
use App\Entity\System\User;

trait FileSystemAwareTrait
{
    /** @var string */
    private $rootDir;

    public function getRootDir(): string
    {
        return $this->rootDir;
    }

    public function getPrivateFolder(): string
    {
        return $this->rootDir.'/private';
    }

    public function getPublicFolder(): string
    {
        return $this->rootDir.'/public';
    }

    public function getUserPrivateFolder(User $user): string
    {
        return $this->getPrivateFolder().'/'.$user->getId();
    }

    public function getAbsolutePath(File $file): string
    {
        return $this->rootDir.'/'.$file->getDestination();
    }

}
