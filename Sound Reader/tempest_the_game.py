# Example file showing a circle moving on screen
import pygame
import math

# pygame setup
pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()
running = True
dt = 0

player_pos = pygame.Vector2(screen.get_width() / 2, screen.get_height() / 2)
player_size = 20
player_aim = 0

def rotate(origin, point, angle):
    """
    Rotate a point counterclockwise by a given angle around a given origin.

    The angle should be given in radians.
    """
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)
    return qx, qy


while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # fill the screen with a color to wipe away anything from last frame
    screen.fill("white")

    pygame.draw.circle(screen, "red", player_pos, player_size)
    atopx, atopy = rotate(player_pos, (player_pos.x, player_pos.y+player_size), player_aim)
    abtopx, abtopy = rotate(player_pos, (player_pos.x*1.01, player_pos.y+player_size), player_aim)
    btopx, btopy = rotate(player_pos, (player_pos.x, player_pos.y+player_size), -player_aim)
    pygame.draw.polygon(screen, "black", [(atopx,atopy), (abtopx,abtopy), player_pos])
    #pygame.draw.polygon(screen, "black", [(btopx,btopy), (player_pos.x+player_size,player_pos.y), (player_pos.x+player_size-10,player_pos.y-10)])
    

    keys = pygame.key.get_pressed()
    if keys[pygame.K_a]:
        player_aim ** 2
    if keys[pygame.K_d]:
        player_aim += .1
    if keys[pygame.K_SPACE]:
        player_size += 1

    # flip() the display to put your work on screen
    pygame.display.flip()

    # limits FPS to 60
    # dt is delta time in seconds since last frame, used for framerate-
    # independent physics.
    dt = clock.tick(60) / 1000

pygame.quit()
