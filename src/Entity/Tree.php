<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TreeRepository")
 */
class Tree
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("tree")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TreeType")
     * @Groups("tree")
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     */
    private $user;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=8)
     * @Groups("tree")
     */
    private $latitude;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=8)
     * @Groups("tree")
     */
    private $longitude;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups("tree")
     */
    private $age;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("tree")
     */
    private $photo;

    /**
     * @var bool
     * @ORM\Column(type="boolean", options={"default": false})
     */
    private $active;

    /**
     * @var string
     * @ORM\Column(type="string", nullable=true)
     */
    private $ip;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $date;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?TreeType
    {
        return $this->type;
    }

    public function setType(?TreeType $type): void
    {
        $this->type = $type;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    public function getLatitude()
    {
        return $this->latitude;
    }

    public function setLatitude($latitude): void
    {
        $this->latitude = $latitude;
    }

    public function getLongitude()
    {
        return $this->longitude;
    }

    public function setLongitude($longitude): void
    {
        $this->longitude = $longitude;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(?int $age): void
    {
        $this->age = $age;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): void
    {
        $this->photo = $photo;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): void
    {
        $this->active = $active;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function setIp(?string $ip): void
    {
        $this->ip = $ip;
    }

    public function getDate(): int
    {
        return $this->date;
    }

    public function setDate(int $date): void
    {
        $this->date = $date;
    }
}
