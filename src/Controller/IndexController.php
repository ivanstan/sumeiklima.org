<?php

namespace App\Controller;

use App\Controller\Admin\TreeController;
use App\Entity\User;
use App\Service\FileManager;
use App\Service\MailerService;
use App\Service\Traits\FileSystemAwareTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    use FileSystemAwareTrait;

    private const DOWNLOAD = [
        'betula-pendula',
        'quercus-petraea',
        'pinus-nigra',
    ];

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
     * @Route("/download/{file}", name="app_data_download")
     */
    public function download(string $file, FileManager $manager): Response
    {
        $filename = $manager->getPublicFolder()."/data/$file.json";

        if (in_array($file, self::DOWNLOAD, false) && file_exists($filename)) {
            $response = new BinaryFileResponse($filename);

            $response->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                $file.'.json'
            );

            return $response;
        }

        throw new BadRequestHttpException(\sprintf("Invalid file name %s", $file));
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
            $name = $request->get('name');
            $captcha = $request->get('g-recaptcha-response');

            $postdata = http_build_query(
                [
                    'secret' => '6LeWvawUAAAAABU42NVFQ2qGXRDOpFj447hdQLo3',
                    'response' => $captcha,
                ]
            );

            $opts = [
                'http' =>
                    [
                        'method' => 'POST',
                        'header' => 'Content-Type: application/x-www-form-urlencoded',
                        'content' => $postdata,
                    ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ];

            $result = file_get_contents(
                'https://www.google.com/recaptcha/api/siteverify',
                false,
                stream_context_create($opts)
            );

            $result = json_decode($result, true);
            $success = $result['success'] ?? false;

            $subject = sprintf('Kontakt od korisnika %s', $email);

            $body = $mailer->getTwig()->render('email/contact.html.twig', [
                'subject' => $subject,
                'email' => $email,
                'content' => $content,
                'name' => $name,
            ]);

            if ($success === true) {
                $this->addFlash('success', 'Vaša poruka je uspešno poslata.');

                $mailer->send($subject, $body, 'tlezaic@gmail.com');
            } else {
                $this->addFlash('danger', 'reCAPTCHA nije popunjena.');
            }
        }

        return $this->render('pages/index/contact.html.twig');
    }
}
