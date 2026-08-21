import type { LocaleMessages } from './type'
import { defineLocale } from '@nuxt/ui/composables/defineLocale'

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
    },
    ConfirmModal: {
      actions: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
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
      CommentConfirmDelete: {
        title: 'Supprimer le commentaire',
        description: 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action ne peut pas être annulée.',
        successMessage: 'Le commentaire a été supprimé avec succès.',
        errorMessage: 'Une erreur est survenue lors de la suppression du commentaire.',
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
