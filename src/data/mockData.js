// src/data/mockData.js
// Données mockées pour le MVP avant l'implémentation d'une vraie base de données

const mockData = {
    users: [
      {
        id: "u1",
        username: "martin_collectionneur",
        email: "martin@example.com",
        password: "hashed_password_here", // Dans une vraie application, ce serait un hash cryptographique
        firstName: "Martin",
        lastName: "Dubois",
        profilePicture: "/images/profiles/martin.jpg",
        bio: "Passionné de littérature sci-fi et vinyles des années 70-80",
        dateJoined: "2025-02-15T10:30:00Z",
        preferences: {
          privacySettings: {
            showCollection: true,
            showActivity: true,
            allowMessages: true
          },
          collectionDisplay: {
            defaultView: "shelf",
            sortBy: "title"
          }
        }
      },
      {
        id: "u2",
        username: "sophie_cin",
        email: "sophie@example.com",
        password: "hashed_password_here",
        firstName: "Sophie",
        lastName: "Bernard",
        profilePicture: "/images/profiles/sophie.jpg",
        bio: "Cinéphile et collectionneuse de films rares et classiques",
        dateJoined: "2025-01-20T14:15:00Z",
        preferences: {
          privacySettings: {
            showCollection: false,
            showActivity: true,
            allowMessages: true
          },
          collectionDisplay: {
            defaultView: "list",
            sortBy: "dateAdded"
          }
        }
      }
    ],
    collections: [
      {
        id: "c1",
        ownerId: "u1",
        name: "Ma bibliothèque sci-fi",
        description: "Mes romans de science-fiction préférés",
        coverImage: "/images/collections/scifi.jpg",
        isPublic: true,
        dateCreated: "2025-02-16T11:20:00Z",
        lastModified: "2025-04-10T09:45:00Z",
        items: ["i1", "i2", "i5"]
      },
      {
        id: "c2",
        ownerId: "u1",
        name: "Vinyles Rock Progressif",
        description: "Ma collection de vinyles rock progressif des années 70-80",
        coverImage: "/images/collections/vinyles.jpg",
        isPublic: true,
        dateCreated: "2025-02-17T15:30:00Z",
        lastModified: "2025-04-08T18:20:00Z",
        items: ["i3", "i4"]
      },
      {
        id: "c3",
        ownerId: "u2",
        name: "Films Classiques",
        description: "Ma collection de films classiques en Blu-ray",
        coverImage: "/images/collections/films.jpg",
        isPublic: false,
        dateCreated: "2025-01-22T10:15:00Z",
        lastModified: "2025-04-05T16:40:00Z",
        items: ["i6", "i7"]
      }
    ],
    items: [
      {
        id: "i1",
        type: "book",
        title: "Fondation",
        description: "Premier tome de la saga Fondation",
        year: 1951,
        images: ["/images/items/fondation.jpg"],
        metadata: {
          author: "Isaac Asimov",
          publisher: "Gnome Press",
          isbn: "978-2070360536",
          genre: "Science-fiction",
          format: "Poche",
          language: "Français",
          pageCount: 256
        },
        market: {
          estimatedValue: 15.99,
          lastUpdated: "2025-03-15T00:00:00Z",
          condition: "Bon état"
        },
        userSpecific: {
          ownerId: "u1",
          collectionId: "c1",
          dateAdded: "2025-02-16T11:22:00Z",
          notes: "Édition française de 1999, quelques pages cornées",
          tags: ["classique", "série", "fondation"],
          favorite: true
        }
      },
      {
        id: "i2",
        type: "book",
        title: "Dune",
        description: "Roman emblématique de Frank Herbert",
        year: 1965,
        images: ["/images/items/dune.jpg"],
        metadata: {
          author: "Frank Herbert",
          publisher: "Robert Laffont",
          isbn: "978-2221252055",
          genre: "Science-fiction",
          format: "Broché",
          language: "Français",
          pageCount: 720
        },
        market: {
          estimatedValue: 24.50,
          lastUpdated: "2025-03-10T00:00:00Z",
          condition: "Très bon état"
        },
        userSpecific: {
          ownerId: "u1",
          collectionId: "c1",
          dateAdded: "2025-02-20T14:30:00Z",
          notes: "Édition collector avec illustrations",
          tags: ["classique", "dune", "désert"],
          favorite: true
        }
      },
      {
        id: "i3",
        type: "vinyl",
        title: "Dark Side of the Moon",
        description: "Album emblématique de Pink Floyd",
        year: 1973,
        images: ["/images/items/dsotm.jpg"],
        metadata: {
          artist: "Pink Floyd",
          label: "Harvest",
          format: "LP",
          releaseDate: "1973-03-01",
          genre: "Rock Progressif",
          condition: "Near Mint"
        },
        market: {
          estimatedValue: 120.00,
          lastUpdated: "2025-04-01T00:00:00Z",
          condition: "Near Mint"
        },
        userSpecific: {
          ownerId: "u1",
          collectionId: "c2",
          dateAdded: "2025-02-17T15:35:00Z",
          notes: "Pressage original de 1973 avec tous les autocollants et poster",
          tags: ["pink floyd", "classique", "pressage original"],
          favorite: true
        }
      },
      {
        id: "i4",
        type: "vinyl",
        title: "Close to the Edge",
        description: "Album de Yes",
        year: 1972,
        images: ["/images/items/ctte.jpg"],
        metadata: {
          artist: "Yes",
          label: "Atlantic",
          format: "LP",
          releaseDate: "1972-09-13",
          genre: "Rock Progressif",
          condition: "Very Good Plus"
        },
        market: {
          estimatedValue: 75.00,
          lastUpdated: "2025-03-25T00:00:00Z",
          condition: "Very Good Plus"
        },
        userSpecific: {
          ownerId: "u1",
          collectionId: "c2",
          dateAdded: "2025-03-05T18:20:00Z",
          notes: "Pochette légèrement usée aux coins",
          tags: ["yes", "rock prog", "années 70"],
          favorite: false
        }
      },
      {
        id: "i5",
        type: "book",
        title: "Neuromancien",
        description: "Roman fondateur du mouvement cyberpunk",
        year: 1984,
        images: ["/images/items/neuromancer.jpg"],
        metadata: {
          author: "William Gibson",
          publisher: "J'ai Lu",
          isbn: "978-2290349267",
          genre: "Science-fiction, Cyberpunk",
          format: "Poche",
          language: "Français",
          pageCount: 320
        },
        market: {
          estimatedValue: 8.50,
          lastUpdated: "2025-02-28T00:00:00Z",
          condition: "Bon état"
        },
        userSpecific: {
          ownerId: "u1",
          collectionId: "c1",
          dateAdded: "2025-03-15T10:10:00Z",
          notes: "Traduction française de Jean Bonnefoy",
          tags: ["cyberpunk", "classique", "gibson"],
          favorite: false
        }
      },
      {
        id: "i6",
        type: "film",
        title: "Casablanca",
        description: "Film classique avec Humphrey Bogart et Ingrid Bergman",
        year: 1942,
        images: ["/images/items/casablanca.jpg"],
        metadata: {
          director: "Michael Curtiz",
          studio: "Warner Bros.",
          format: "Blu-ray",
          runtime: 102,
          genre: "Drame, Romance",
          language: "Anglais, Français"
        },
        market: {
          estimatedValue: 22.99,
          lastUpdated: "2025-01-30T00:00:00Z",
          condition: "Excellent"
        },
        userSpecific: {
          ownerId: "u2",
          collectionId: "c3",
          dateAdded: "2025-01-22T10:25:00Z",
          notes: "Édition collector restaurée avec bonus",
          tags: ["noir et blanc", "classique", "bogart"],
          favorite: true
        }
      },
      {
        id: "i7",
        type: "film",
        title: "Le Parrain",
        description: "Chef-d'œuvre de Francis Ford Coppola",
        year: 1972,
        images: ["/images/items/godfather.jpg"],
        metadata: {
          director: "Francis Ford Coppola",
          studio: "Paramount Pictures",
          format: "Blu-ray",
          runtime: 175,
          genre: "Crime, Drame",
          language: "Anglais, Français, Italien"
        },
        market: {
          estimatedValue: 29.99,
          lastUpdated: "2025-02-15T00:00:00Z",
          condition: "Très bon état"
        },
        userSpecific: {
          ownerId: "u2",
          collectionId: "c3",
          dateAdded: "2025-02-10T16:50:00Z",
          notes: "Coffret trilogie complète",
          tags: ["mafia", "oscar", "coppola", "pacino"],
          favorite: true
        }
      }
    ]
  };
  
  export default mockData;