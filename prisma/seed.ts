import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@getlazoo.org',
    posts: {
      create: [
        {
          title: 'Welcome to Lazo !',
          content: 'This is a content example',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Looser',
    email: 'iwanttobepublished@nulos.org',
    posts: {
      create: [
        {
          title: 'This is a draft',
          content: 'please publish me !',
          published: false,
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
