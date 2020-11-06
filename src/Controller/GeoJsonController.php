<?php

namespace App\Controller;

use GuzzleHttp\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GeoJsonController extends AbstractController
{
    /**
     * @Route("/api/geojson", name="geojson_tile", methods={"POST"})
     */
    public function tile(Request $request): Response
    {
        $url = rtrim($this->getParameter('elasticsearch_url'), '/');
        $index = $this->getParameter('elasticsearch_index');

        $response = (new Client())->request(
            'POST',
            "$url/$index/_search",
            [
                'body' => $request->getContent(),
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]
        );

        $result = json_decode($response->getBody()->getContents(), true);

        return new JsonResponse($result['hits'] ?? []);
    }
}