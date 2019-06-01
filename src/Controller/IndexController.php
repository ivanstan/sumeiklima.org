<?php

namespace App\Controller;

use App\Controller\Admin\TreeController;
use App\Entity\User;
use App\Service\MailerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * @Route("/", name="app_index")
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($user && $user->hasRole(User::ROLE_ADMIN)) {
            return $this->forward(TreeController::class .'::index');
        }

        return $this->render('pages/index/index.html.twig');
    }

    /**
     * @Route("/gde-pošumiti", name="app_data_index")
     */
    public function data(): Response
    {
        return $this->render('pages/index/data.html.twig');
    }

    /**
     * @Route("/api/feedback", name="api_feedback")
     */
    public function feedback(): Response
    {
        return new JsonResponse([]);
    }

    /**
     * @Route("/kontakt", name="app_contact")
     */
    public function contact(Request $request, MailerService $mailer): Response
    {
        if ($request->isMethod('post')) {
            $content = $request->get('content');
            $email = $request->get('email');

            $subject = sprintf('Kontakt od korisnika %s', $email);

            $body = $mailer->getTwig()->render('email/contact.html.twig', [
                'subject' => $subject,
                'email' => $email,
                'content' => $content,
            ]);

            $this->addFlash('success', 'Vaša poruka je uspešno poslata.');

            $mailer->send($subject, $body, $email);
        }

        return $this->render('pages/index/contact.html.twig');
    }
}
