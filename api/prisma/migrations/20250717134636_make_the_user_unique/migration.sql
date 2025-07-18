/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `views` INTEGER NOT NULL DEFAULT 0,
    MODIFY `likes` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
