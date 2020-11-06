<?php

namespace App\Repository;

use App\Entity\Token\UserToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserToken::class);
    }

    public function getToken(string $token, string $type): ?UserToken
    {
        $builder =  $this->createQueryBuilder('t')
            ->select('t', 'u')
            ->join('t.user', 'u')
            ->where('t.token = :token')->setParameter('token', $token)
            ->andWhere('t INSTANCE OF :type')->setParameter('type', $this->getEntityManager()->getClassMetadata($type));

        $result = $builder->getQuery()->getResult();

        return $result[0] ?? null;
    }
}
