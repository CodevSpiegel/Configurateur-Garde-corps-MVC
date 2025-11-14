<?php
/**
 * ============================================================================
 * app\controllers\ConfigurateurController.php
 * ============================================================================
 * Affichage du configurateur (index) + API POST /configurateur/create
 * pour enregistrer un devis en BDD via le modèle Devis.
 * On centralise ici la logique qui était précédemment dans DevisController::create().
 * -----------------------------------------------------------------------------
 */

require_once ROOT . 'app/models/Devis.php'; // ✅ on a besoin du modèle pour insérer

class ConfigurateurController extends Controller {

    private Sessions $session;

    public function __construct()
    {
        $this->session = new Sessions();
        $this->session->requireAuth();
    }

    /**
     * Page d’accueil du configurateur (vue front avec le module JS)
     */
    public function index() {
        $title = "Configurateur";
        $this->view( 'configurateur/index', compact( 'title' ) );
    }

    /**
     * API de création d’un devis (JSON) — remplace DevisController::create()
     * URL cible recommandée :  POST  /configurateur/create
     *
     * ⚠ Réponse JSON (header + http codes)
     * ⚠ Ne reçoit QUE des IDs + mesures, JAMAIS des labels
     */
    public function createDevis()
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
        $userId = $this->session->user()['id'] ?? 0;
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
