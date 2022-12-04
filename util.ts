import { EmbedBuilder, AttachmentBuilder, Message, GuildMember, Collection, PermissionsBitField, User, APIGuildMember, Role, APIRole, ChatInputCommandInteraction } from 'discord.js';

type FetchSpriteType = {
    back_default: string,
    back_female: string,
    back_shiny: string,
    back_shiny_female: string,
    front_default: string,
    front_female: string,
    front_shiny: string,
    front_shiny_female: string,
    other: {
        dream_world: {
            front_default: string,
            fromt_female: string
        },
        home: {
            front_default: string,
            front_female: string,
            front_shiny: string,
            front_shiny_female: string
        },
        official_artwork: {
            front_default: string
        }
    }
};

export default class Util {
    
    // Wraps reply in poke-guesser themed embed
    static returnEmbed(title: string, message: string, color: number = 0x00AE86, image: string | null = null): EmbedBuilder | {embed: EmbedBuilder, attachment: AttachmentBuilder} {
        // Creates new embedded message
        let embed = new EmbedBuilder()
            .setTitle(title)
            .setAuthor({
                name: 'POKÉ-GUESSER BOT',
                url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                iconURL: 'https://github.com/GeorgeCiesinski/poke-guesser-bot'
            }).setColor(color)
            .setDescription(message)
            .setThumbnail('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png')
            .setFooter({
                text: 'By borreLore, Wissididom and Valley Orion',
                iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png'
            });
        // Adds image (if applicable) and returns both (if applicable)
        if (image) {
            let attachment = new AttachmentBuilder(image, { name: 'pokemon.png' });
            embed.setImage('attachment://pokemon.png');
            return {
                embed,
                attachment
            }
        } else {
            return embed;
        }
    }

    // Capitalizes first letter of pokemon name
    static capitalize(str: string): string {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    // Finds the GuildMember by User-IDs (either string or array)
    static async  findMember(message: Message, ids: string | string[]): Promise<Collection<string, GuildMember> | undefined> {
        // Return member or undefined if not found (force specifies if cache should be checked)
        // I could have omitted the force property, but i have put it there to make it clear
        return await message.guild?.members.fetch({ user: ids, force: false});
    }

    // Finds the User by User-ID
    static async findUser(message: Message, ids: string | string[]): Promise<User | User[] | undefined> {
        let member = await this.findMember(message, ids);
        if (Array.isArray(ids)) {
            if (!member) {
                console.log(`WARNING: User IDs ${ids.join(', ')} not found in guild.`);
                return member;
            }
            return member.map((member) => {
                return member.user;
            });
        } else {
            if (!member) {
                console.log(`WARNING: User ID ${ids} not found in guild.`);
                return member;
            }
            return member.get(ids)?.user;
        }
    }

    static isAdmin(member: GuildMember): boolean {
        return member.id == member.guild.ownerId || member.permissions.has(PermissionsBitField.Flags.Administrator);
    }

    static isUser(mentionable: User | GuildMember | APIGuildMember | Role | APIRole): boolean {
        return mentionable instanceof User || mentionable instanceof GuildMember;
    }

    static isRole(mentionable: User | GuildMember | APIGuildMember | Role | APIRole): boolean {
        return mentionable instanceof Role;
    }

    static async generatePokemon(): Promise<{name: string, url: string}> {
        // Fetch json of all available pokemon up to a limit of 2000 (~1200 available)
        let res: Response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=2000');
        let json: any = await res.json();
        let result: {name: string, url: string}[] = json.results;
        return result[Math.floor(Math.random() * result.length)];
    }

    // Fetches the sprite using the pokemon's api url
    static async fetchSprite(url: string): Promise<FetchSpriteType> {
        let res: Response = await fetch(url);
        let json: any = await res.json();
        let sprites: FetchSpriteType = {
            back_default: json.sprites.back_default,
            back_female: json.sprites.back_female,
            back_shiny: json.sprites.back_shiny,
            back_shiny_female: json.sprites.back_shiny_female,
            front_default: json.sprites.front_default,
            front_female: json.sprites.front_female,
            front_shiny: json.sprites.front_shiny,
            front_shiny_female: json.sprites.front_shiny_female,
            other: {
                dream_world: {
                    front_default: json.sprites.other.dream_world.front_default,
                    fromt_female: json.sprites.other.dream_world.front_female
                },
                home: {
                    front_default: json.sprites.other.home.front_default,
                    front_female: json.sprites.other.home.front_female,
                    front_shiny: json.sprites.other.home.front_shiny,
                    front_shiny_female: json.sprites.other.home.front_shiny_female
                },
                official_artwork: {
                    front_default: json.sprites.other['official-artwork'].front_default
                }
            }
        };
        return sprites;
    }

    static async fetchNames(nameOrId: string): Promise<{languageName: string, languageUrl: string, name: string}[] | null> {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}/`);
            const json = await res.json();
            const names: {language: {name: string, url: string}, name: string}[] = json.names;
            return names.map((name: {language: {name: string, url: string}, name: string}) => {
                return {
                    languageName: name.language.name,
                    languageUrl: name.language.url,
                    name: name.name
                }
            });
        } catch (err) {
            // For example id 10220 returns 404 Not Found
            return null;
        }
    }

    static async editReply(interaction: ChatInputCommandInteraction, title: string, description: string): Promise<Message<boolean>> {
        return await interaction.editReply({
            embeds: [
                Util.returnEmbed(title, description) as EmbedBuilder
            ]
        });
    }
}
