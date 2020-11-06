<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TreeTypeRepository")
 */
class TreeType
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("tree")
     */
    private $serbian;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("tree")
     */
    private $latin;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default": false})
     */
    private $active;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSerbian(): ?string
    {
        return $this->serbian;
    }

    public function setSerbian(?string $serbian): void
    {
        $this->serbian = $serbian;
    }

    public function getLatin(): ?string
    {
        return $this->latin;
    }

    public function setLatin(?string $latin): void
    {
        $this->latin = $latin;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): void
    {
        $this->active = $active;
    }
}
