<?php
/**
 * app/controllers/DevisController.php
 * Reçoit UNIQUEMENT des IDs + mesures et insère dans cfg_devis
 * en utilisant la classe Devis (modèle) + Database::getInstance() via Model.
 */

// Charge les classes de base si l'autoload ne l'a pas fait
// Assure le chargement des classes de base
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Database.php'; // ← important pour le modèle (Database::getInstance)
require_once __DIR__ . '/../models/Devis.php';

class DevisController extends Controller
{
    /**
     * URL: /devis/create  (POST)
     * Payload JSON attendu :
     * {
     *   "typeId": 2, "finitionId": 1, "formeId": 3, "poseId": 1, "ancrageId": 2, "verreId": 5,
     *   "longueur_a": 350, "longueur_b": 210, "longueur_c": null, "hauteur": 110, "angle": 35,
     *   "quantity": 1
     * }
     */
    public function create()
    {
        // Toujours forcer JSON pour une action d’API
        header('Content-Type: application/json; charset=utf-8');

        // 1) Si ce n’est pas un POST, on sort AVANT toute variable (évite les "Undefined variable …")
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['ok' => false, 'error' => 'Utiliser POST.']);
            exit;
        }

        // (Optionnel en dev: éviter que les notices HTML polluent la réponse JSON)
        // ini_set('display_errors', 0);

        // 2) Lire et décoder le JSON
        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'JSON invalide.']);
            exit;
        }

        // 3) Helpers simples
        $toIntOrNull = function($k) use ($data) {
            if (!array_key_exists($k, $data) || $data[$k] === '' || $data[$k] === null) return null;
            return is_numeric($data[$k]) ? (int)$data[$k] : null;
        };
        $toTiny  = function($k) use ($toIntOrNull){ $v=$toIntOrNull($k); if($v===null)return null; return max(0, min(255, $v)); };
        $toSmall = function($k) use ($toIntOrNull){ $v=$toIntOrNull($k); if($v===null)return null; return max(0, min(65535,$v)); };

        // 4) Définir TOUTES les variables AVANT validation
        $typeId     = $toTiny('typeId');
        $finitionId = $toTiny('finitionId');
        $formeId    = $toTiny('formeId');
        $poseId     = $toTiny('poseId');
        $ancrageId  = $toTiny('ancrageId');
        $verreId    = $toTiny('verreId');

        $longA = $toSmall('longueur_a');
        $longB = $toSmall('longueur_b');
        $longC = $toSmall('longueur_c');
        $haut  = $toSmall('hauteur');
        $ang   = $toTiny('angle');

        $quantity = $toTiny('quantity') ?? 1;
        $userId   = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
        $now      = time();

        // 5) Validation souple (évite les undefined + accepte devis partiels)
        $hasAnyId      = ($typeId || $finitionId || $formeId || $poseId || $ancrageId || $verreId);
        $hasAnyMeasure = ($longA || $longB || $longC || $haut || $ang);
        if (!$hasAnyId && !$hasAnyMeasure) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Aucune donnée exploitable (IDs/mesures manquants).']);
            exit;
        }

        // 6) Insert via modèle
        try {
            $model = new Devis(); // Model étend Model et utilise Database::getInstance()
            $id = $model->insert([
                'user_id'     => $userId,
                'type_id'     => $typeId,
                'finition_id' => $finitionId,
                'forme_id'    => $formeId,
                'pose_id'     => $poseId,
                'ancrage_id'  => $ancrageId,
                'verre_id'    => $verreId,
                'longueur_a'  => $longA,
                'longueur_b'  => $longB,
                'longueur_c'  => $longC,
                'hauteur'     => $haut,
                'angle'       => $ang,
                'quantity'    => $quantity,
                'id_status'   => 1,
                'create_date' => $now,
                'update_date' => $now,
            ]);

            echo json_encode(['ok' => true, 'devisId' => $id]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Erreur serveur', 'details' => $e->getMessage()]);
            exit;
        }
    }

}
