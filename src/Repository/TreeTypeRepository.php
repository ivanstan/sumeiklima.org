<?php

namespace App\Repository;

use App\Entity\TreeType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TreeTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TreeType::class);
    }

    /**
     * @return TreeType[]
     */
    public function search(string $value): array
    {
        $builder = $this->createQueryBuilder('t')
            ->orderBy('t.serbian', 'ASC')
            ->where('t.active = TRUE')
            ->setMaxResults(10);

        if ($value) {
            $builder
                ->andWhere('t.serbian LIKE :search OR t.latin LIKE :search')
                ->setParameter('search', '%'.$value.'%');
        }

        return $builder->getQuery()->getResult();
    }
}
