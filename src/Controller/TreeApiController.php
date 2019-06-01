<?php

namespace App\Controller;

use App\Entity\Tree;
use App\Entity\TreeType;
use App\Entity\User;
use App\Service\FileManager;
use App\Service\Traits\FileSystemAwareTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class TreeApiController extends AbstractController
{
    use FileSystemAwareTrait;

    /**
     * @Route("/tree/autocomplete", name="app_tree_autocomplete")
     */
    public function autocomplete(Request $request, SerializerInterface $serializer): Response
    {
        $data = $this->getDoctrine()->getRepository(TreeType::class)->search($request->get('search'));

        return new Response($serializer->serialize($data, 'json'));
    }

    /**
     * @Route("/tree/list", name="app_tree_list")
     */
    public function list(SerializerInterface $serializer): Response
    {
        $trees = $this->getDoctrine()->getRepository(Tree::class)->findBy(['active' => true]);

        return new Response ($serializer->serialize($trees, 'json', ['groups' => 'tree']));
    }

    /**
     * @Route("/tree/save", name="app_tree_save", methods={"POST"})
     */
    public function save(Request $request, FileManager $manager): Response
    {
        $body = json_decode($request->getContent(), true) ?? [];

        $age = $body['age'] ?? null;
        $email = $body['email'] ?? null;
        $latitude = $body['latitude'] ?? null;
        $longitude = $body['longitude'] ?? null;
        $image = $body['image'] ?? null;
        $type = isset($body['type']) ? json_decode($body['type'], true) : null;

        $fileName = null;
        if ($image !== null) {
            $fileName = 'public/images/upload/'.md5($image).'.jpg';

            $manager->save($manager->getRootDir().'/'.$fileName, base64_decode($image));
        }

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($user === null) {
            $user = new User();
            $user->setActive(true);
            $user->setVerified(false);
            $user->setEmail($email);
            $user->setRoles([User::ROLE_USER]);
            $this->getDoctrine()->getManager()->persist($user);
        }

        $typeId = $type['id'] ?? null;
        $typeSerbian = $type['serbian'] ?? null;
        $typeLatin = $type['latin'] ?? null;

        $type = null;
        if ($typeId === null && ($typeSerbian !== null || $typeLatin !== null)) {
            $type = new TreeType();
            $type->setActive(false);
            $type->setSerbian($typeSerbian);
            $type->setLatin($typeLatin);
            $this->getDoctrine()->getManager()->persist($type);
        } else {
            if ($typeId !== null) {
                $type = $this->getDoctrine()->getRepository(TreeType::class)->find($typeId);
            }
        }

        $tree = new Tree();
        $tree->setLatitude($latitude);
        $tree->setLongitude($longitude);
        $tree->setAge($age);
        $tree->setPhoto($fileName);
        $tree->setUser($user);
        $tree->setActive(false);
        $tree->setType($type);
        $tree->setDate(time());
        $tree->setIp($request->getClientIp());

        $this->getDoctrine()->getManager()->persist($tree);
        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse($body);
    }
}
