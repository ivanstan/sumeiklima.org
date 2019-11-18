<?php

namespace App\Controller\Admin;

use App\Entity\Lock;
use App\Entity\Tree;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/admin")
 */
class TreeController extends AbstractController
{
    /**
     * @Route("/trees", name="admin_trees")
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(Request $request): Response
    {
        $builder = $this->getDoctrine()->getRepository(Tree::class)->getInactive();

        $pager = new Pagerfanta(new DoctrineORMAdapter($builder));
        $pager->setCurrentPage($request->get('page', 1));

        return $this->render('pages/admin/tree/index.html.twig', [
            'pager' => $pager,
        ]);
    }

    /**
     * @Route("/tree/enable/{tree}", name="admin_tree_enable")
     * @IsGranted("ROLE_ADMIN")
     */
    public function enable(Tree $tree): Response
    {
        $tree->setActive(true);

        if ($type = $tree->getType()) {
            $type->setActive(true);
        }

        $this->getDoctrine()->getManager()->flush();

        return $this->redirectToRoute('admin_trees');
    }

    /**
     * @Route("/tree/delete/{tree}", name="admin_tree_delete")
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(Tree $tree): Response
    {
        $this->getDoctrine()->getManager()->remove($tree);
        $this->getDoctrine()->getManager()->flush();

        return $this->redirectToRoute('admin_trees');
    }
}
