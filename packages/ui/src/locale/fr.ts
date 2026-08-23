import type { LocaleMessages } from './type'

export default defineLocale<LocaleMessages>({
  name: 'Français',
  code: 'fr',
  dir: 'ltr',
  messages: {
    Editor: {
      placeholder: 'Écrivez quelque chose...',
      write: {
        help: 'Vous pouvez utiliser la syntaxe Markdown pour formater le contenu.',
      },
      preview: {
        loading: 'Chargement de l’aperçu...',
        placeholder: 'Aucun contenu à prévisualiser.',
      },
      tabs: {
        write: 'Écrire',
        preview: 'Aperçu',
      },
    },
    LoginRequired: {
      text: 'Vous devez être connecté pour accéder à cette fonctionnalité.',
      action: 'Se connecter',
      errors: {
        popupBlocked: 'La fenêtre de connexion a été bloquée. Autorisez les fenêtres contextuelles et réessayez.',
        popupClosed: 'La fenêtre de connexion a été fermée avant la fin de l’authentification.',
        refreshFailed: 'Vous êtes connecté, mais votre session n’a pas pu être actualisée. Veuillez réessayer.',
      },
    },
    LoginCallback: {
      success: 'Connexion terminée. Vous pouvez fermer cette fenêtre.',
      error: 'La connexion n’a pas pu être terminée. Fermez cette fenêtre et réessayez.',
    },
    ConfirmModal: {
      actions: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
      },
    },
    Feedback: {
      action: 'Donner mon avis',
    },
    FeedbackCard: {
      placeholder: 'Votre avis...',
      action: 'Envoyer',
      ratings: {
        hate: 'Je déteste',
        poor: 'Pas terrible',
        okay: 'Ça va',
        love: 'J’adore',
      },
      success: {
        received: 'Votre avis a bien été reçu.',
        thanks: 'Merci pour votre aide !',
      },
      errors: {
        notFound: 'Page introuvable. Impossible d’envoyer votre avis.',
        unavailable: 'Le service est indisponible. Veuillez réessayer plus tard.',
        unexpected: 'Une erreur inattendue est survenue.',
      },
    },
    comments: {
      Comment: {
        actions: {
          edit: 'Modifier',
          delete: 'Supprimer',
        },
        actionMenu: 'Actions du commentaire',
      },
      CommentDeleteConfirmModal: {
        title: 'Supprimer le commentaire',
        description: 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action ne peut pas être annulée.',
      },
      CommentFormSection: {
        title: 'Ajouter un commentaire',
      },
      CommentHeader: {
        author: 'Auteur',
        publishedAt: 'Publié le',
      },
      CommentLike: {
        title: 'Aimer ce commentaire',
      },
      CommentUnlike: {
        title: 'Retirer votre like',
      },
      CommentRepliesCount: {
        replies: '{count} réponses',
        reply: '{count} réponse',
      },
      CommentForm: {
        actions: {
          add: 'Commenter',
          reply: 'Répondre',
          edit: 'Modifier',
          cancel: 'Annuler',
        },
      },
      errors: {
        create: 'Une erreur est survenue lors de l’ajout du commentaire.',
        update: 'Une erreur est survenue lors de la modification du commentaire.',
        delete: 'Une erreur est survenue lors de la suppression du commentaire.',
        like: 'Une erreur est survenue lors de l’ajout du like.',
        unlike: 'Une erreur est survenue lors de la suppression du like.',
      },
      success: {
        delete: 'Le commentaire a bien été supprimé.',
      },
    },
    discussions: {
      DiscussionReply: {
        reply: 'Répondre à cette discussion...',
      },
      DiscussionsSection: {
        empty: 'Aucune discussion pour le moment.',
      },
      DiscussionsSectionTitle: {
        title: 'Discussions',
      },
      DiscussionsSectionSubtitle: {
        comments: {
          plural: '{count} commentaires',
          singular: '{count} commentaire',
        },
        replies: {
          plural: '{count} réponses',
          singular: '{count} réponse',
        },
      },
    },
    state: {
      empty: 'Aucune donnée à afficher.',
      error: 'Une erreur est survenue lors du chargement des données.',
      pending: 'Chargement des données...',
    },
  },
})
